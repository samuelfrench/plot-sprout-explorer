#!/usr/bin/env python3
"""Unit tests for the local Plot Sprout image generator.

These tests deliberately avoid loading SDXL or touching CUDA.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import types
import unittest
from unittest.mock import patch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import generate_story_images_local as generator_module
from generate_story_images_local import NEGATIVE_PROMPT, ROOT, generate_job, manifest_jobs


class FakeGenerator:
    def __init__(self) -> None:
        self.seed = None

    def manual_seed(self, seed: int) -> None:
        self.seed = seed


class FakeImage:
    def __init__(self) -> None:
        self.saved = []

    def save(self, path: Path, image_format: str, **_kwargs) -> None:
        self.saved.append((path, image_format))
        Path(path).write_bytes(f"fake {image_format}".encode("utf8"))


class FakePipeline:
    def __init__(self) -> None:
        self.calls = []
        self.image = FakeImage()

    def __call__(self, **kwargs):
        self.calls.append(kwargs)
        return type("FakePipelineResult", (), {"images": [self.image]})()


class ImageGeneratorConfigTest(unittest.TestCase):
    def test_module_import_does_not_require_gpu_dependencies(self) -> None:
        code = """
import importlib.abc
import sys

class GpuDependencyBlocker(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path=None, target=None):
        if fullname.split('.')[0] in {'diffusers', 'PIL', 'torch'}:
            raise ModuleNotFoundError(f"No module named '{fullname}'")
        return None

sys.meta_path.insert(0, GpuDependencyBlocker())
sys.path.insert(0, 'scripts')

from generate_story_images_local import NEGATIVE_PROMPT, manifest_jobs

assert 'weapon' in NEGATIVE_PROMPT
assert callable(manifest_jobs)
"""
        subprocess.run(
            [sys.executable, "-c", code],
            cwd=ROOT,
            check=True,
            env={"PYTHONDONTWRITEBYTECODE": "1"},
        )

    def test_manifest_jobs_preserves_per_image_negative_prompt(self) -> None:
        custom_negative_prompt = "custom batch-only negative prompt"
        with tempfile.TemporaryDirectory(dir=ROOT) as temp_dir:
            manifest_path = Path(temp_dir) / "manifest.json"
            manifest_path.write_text(
                json.dumps(
                    {
                        "images": [
                            {
                                "slug": "sample-product",
                                "prompt": "family-friendly blank printable product image",
                                "outputJpeg": "public/images/plotsprout/test/sample-product.jpg",
                                "outputWebp": "public/images/plotsprout/test/sample-product.webp",
                                "sidecar": "content/image-runs/test/sample-product.json",
                                "seed": 12345,
                                "negativePrompt": custom_negative_prompt,
                            }
                        ]
                    }
                )
            )

            [job] = manifest_jobs(manifest_path, limit=None)

        self.assertEqual(job["negativePrompt"], custom_negative_prompt)

    def test_global_negative_prompt_does_not_block_common_story_props(self) -> None:
        prompt_terms = {part.strip().lower() for part in NEGATIVE_PROMPT.split(",")}
        batch_specific_terms = {
            "plant",
            "potted plant",
            "greenery",
            "jar",
            "cup",
            "mug",
            "bowl",
            "utensil",
            "brush",
            "spoon",
            "fork",
            "knife",
            "pencil",
            "pen",
            "crayon",
            "marker",
            "notebook",
            "spiral binding",
            "ruler",
            "scissors",
        }

        self.assertEqual(prompt_terms & batch_specific_terms, set())

    def test_generate_job_uses_manifest_negative_prompt_for_pipeline_and_sidecar(self) -> None:
        custom_negative_prompt = "custom batch-only negative prompt"
        with tempfile.TemporaryDirectory(dir=ROOT) as temp_dir:
            temp_root = Path(temp_dir).relative_to(ROOT)
            job = {
                "slug": "sample-product",
                "prompt": "family-friendly blank printable product image",
                "outputJpeg": str(temp_root / "sample-product.jpg"),
                "outputWebp": str(temp_root / "sample-product.webp"),
                "sidecar": str(temp_root / "sample-product.json"),
                "seed": 12345,
                "negativePrompt": custom_negative_prompt,
                "mode": "manifest",
                "manifest": "content/image-queue/test-manifest.json",
                "title": "Sample Product",
            }
            pipe = FakePipeline()
            generator = FakeGenerator()

            sidecar = generate_job(pipe, generator, job)

            sidecar_path = ROOT / job["sidecar"]
            written_sidecar = json.loads(sidecar_path.read_text())

        self.assertEqual(generator.seed, 12345)
        self.assertEqual(pipe.calls[0]["negative_prompt"], custom_negative_prompt)
        self.assertEqual(sidecar["negativePrompt"], custom_negative_prompt)
        self.assertEqual(written_sidecar["negativePrompt"], custom_negative_prompt)
        self.assertEqual(written_sidecar["manifest"], "content/image-queue/test-manifest.json")
        self.assertNotIn("elapsedSeconds", written_sidecar)

    def test_load_pipeline_can_use_checkpoint_embedded_vae_without_external_repo(self) -> None:
        calls = {"external_vae": 0, "pipeline_kwargs": {}}

        class FakeTorch:
            float16 = "float16"

        class FakeAutoencoderKL:
            @staticmethod
            def from_pretrained(*_args, **_kwargs):
                calls["external_vae"] += 1
                return object()

        class FakeScheduler:
            config = {"fake": "config"}

        class FakePipeline:
            def __init__(self) -> None:
                self.scheduler = FakeScheduler()

            @classmethod
            def from_single_file(cls, *_args, **kwargs):
                calls["pipeline_kwargs"] = kwargs
                return cls()

            def enable_freeu(self, **_kwargs) -> None:
                return None

            def to(self, _device: str) -> None:
                return None

            def set_progress_bar_config(self, **_kwargs) -> None:
                return None

        class FakeDPMSolverMultistepScheduler:
            @staticmethod
            def from_config(_config, **_kwargs):
                return FakeScheduler()

        fake_diffusers = types.SimpleNamespace(
            AutoencoderKL=FakeAutoencoderKL,
            DPMSolverMultistepScheduler=FakeDPMSolverMultistepScheduler,
            StableDiffusionXLPipeline=FakePipeline,
        )

        with tempfile.TemporaryDirectory(dir=ROOT) as temp_dir:
            checkpoint_path = Path(temp_dir) / "sd_xl_base_1.0.safetensors"
            checkpoint_path.write_bytes(b"fake checkpoint")
            with patch.object(generator_module, "SDXL_BASE_CHECKPOINT", checkpoint_path), patch.object(
                generator_module,
                "SDXL_VAE_REPO",
                "checkpoint",
            ), patch.object(generator_module, "load_torch", return_value=FakeTorch()), patch.dict(
                sys.modules,
                {"diffusers": fake_diffusers},
            ):
                generator_module.load_pipeline()

        self.assertEqual(calls["external_vae"], 0)
        self.assertNotIn("vae", calls["pipeline_kwargs"])


if __name__ == "__main__":
    unittest.main()
