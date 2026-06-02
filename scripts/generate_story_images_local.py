#!/usr/bin/env python3
"""Generate Plot Sprout Explorer images locally on the RTX 4090.

Default output:
  public/images/plotsprout/<slug>.jpg
  content/image-runs/<slug>.json
"""

from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any

os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")


ROOT = Path(__file__).resolve().parents[1]
MODELS_ROOT = Path(os.environ.get("PLOTSPROUT_MODELS_ROOT", ROOT.parent / "ComfyUI/models"))
SDXL_BASE_CHECKPOINT = MODELS_ROOT / "checkpoints/sd_xl_base_1.0.safetensors"
SDXL_VAE_REPO = os.environ.get("PLOTSPROUT_SDXL_VAE", "madebyollin/sdxl-vae-fp16-fix")
OUTPUT_DIR = ROOT / "public/images/plotsprout"
RUN_DIR = ROOT / "content/image-runs"
WIDTH = int(os.environ.get("PLOTSPROUT_IMAGE_WIDTH", "1344"))
HEIGHT = int(os.environ.get("PLOTSPROUT_IMAGE_HEIGHT", "768"))
STEPS = int(os.environ.get("PLOTSPROUT_IMAGE_STEPS", "42"))
GUIDANCE = float(os.environ.get("PLOTSPROUT_IMAGE_GUIDANCE", "7.0"))
JPEG_QUALITY = int(os.environ.get("PLOTSPROUT_IMAGE_JPEG_QUALITY", "92"))
WEBP_QUALITY = int(os.environ.get("PLOTSPROUT_IMAGE_WEBP_QUALITY", "92"))
FREEU_SDXL = dict(b1=1.3, b2=1.4, s1=0.9, s2=0.2)
NEGATIVE_PROMPT = (
    "text, readable writing, letters, logo, watermark, signature, scary, horror, weapon, violence, "
    "brand character, phone, smartphone, tablet, laptop, computer, screen, device, electronics, "
    "printed markings, icon, symbol, distorted faces, distorted hands, blurry, low resolution, harsh shadows"
)

PROMPTS = {
    "moon-muffin-market": (
        "family-friendly Moon Muffin Market scene, tiny moonlit pastry market, cloud carts, "
        "lantern strings shaped like commas, warm cinnamon atmosphere, expressive stalls, "
        "polished storybook illustration for kids, handmade texture, rich detail, No text, "
        "no letters, no logos, no watermark, no scary harm, no weapons"
    ),
    "puddle-planet-post-office": (
        "family-friendly Puddle Planet Post Office scene, sidewalk puddles as tiny planets, "
        "bottle-cap mail carriers, leaf boats with ribbon flags, cheerful rainy-day light, "
        "polished storybook illustration for kids, handmade texture, No text, no letters, "
        "no logos, no watermark, no scary harm, no weapons"
    ),
    "buttonwood-library-train": (
        "family-friendly Buttonwood Library Train scene, pocket-sized train circling a library tree, "
        "acorn lamps, book tunnels, branch platforms with brass bells, cozy storybook illustration, "
        "No text, no letters, no logos, no watermark, no scary harm, no weapons"
    ),
    "cloudberry-clocktower": (
        "family-friendly Cloudberry Clocktower scene, whimsical clocktower above town, berry vines, "
        "teacup weather vanes, breakfast-hour mystery, polished storybook illustration, No text, "
        "no letters, no logos, no watermark, no scary harm, no weapons"
    ),
    "tiny-lantern-reef": (
        "family-friendly Tiny Lantern Reef scene, under-dock glowing reef, paper boats, button coral, "
        "sea glass, ribbon currents, cozy storybook illustration, No text, no letters, no logos, "
        "no watermark, no scary harm, no weapons"
    ),
    "pencil-dragon-academy": (
        "family-friendly Pencil Dragon Academy scene, gentle pencil dragons, graph-paper hills, "
        "compass nests, chalkboard cave, revision magic, polished storybook illustration, No text, "
        "no letters, no logos, no watermark, no scary harm, no weapons"
    ),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate local Plot Sprout images.")
    parser.add_argument("--only", choices=sorted(PROMPTS), action="append")
    parser.add_argument("--all", action="store_true", help="Generate every starter image.")
    parser.add_argument("--manifest", type=Path, help="Generate images from a Batch 4 manifest.")
    parser.add_argument("--limit", type=int, help="Only generate the first N manifest images.")
    parser.add_argument("--skip-existing", action="store_true", help="Skip manifest images whose outputs already exist.")
    return parser.parse_args()


def load_torch() -> Any:
    import torch

    return torch


def load_pipeline() -> Any:
    torch = load_torch()
    from diffusers import AutoencoderKL, DPMSolverMultistepScheduler, StableDiffusionXLPipeline

    if not SDXL_BASE_CHECKPOINT.exists():
        raise FileNotFoundError(f"SDXL base checkpoint not found: {SDXL_BASE_CHECKPOINT}")

    dtype = torch.float16
    print(f"Loading SDXL base: {SDXL_BASE_CHECKPOINT}")
    vae = AutoencoderKL.from_pretrained(SDXL_VAE_REPO, torch_dtype=dtype, local_files_only=True)
    pipe = StableDiffusionXLPipeline.from_single_file(
        str(SDXL_BASE_CHECKPOINT),
        torch_dtype=dtype,
        use_safetensors=True,
        add_watermarker=False,
        vae=vae,
        local_files_only=True,
    )
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(
        pipe.scheduler.config,
        algorithm_type="dpmsolver++",
        use_karras_sigmas=True,
    )
    pipe.enable_freeu(**FREEU_SDXL)
    pipe.to("cuda")
    pipe.set_progress_bar_config(disable=True)
    return pipe


def validate_webp_support() -> None:
    from PIL import features

    if not features.check("webp"):
        raise RuntimeError("Pillow WebP support is required before generating Batch 4 images.")


def starter_jobs(selected: list[str]) -> list[dict[str, Any]]:
    jobs: list[dict[str, Any]] = []
    for index, slug in enumerate(selected):
        jobs.append(
            {
                "slug": slug,
                "prompt": PROMPTS[slug],
                "outputJpeg": str((OUTPUT_DIR / f"{slug}.jpg").relative_to(ROOT)),
                "outputWebp": None,
                "sidecar": str((RUN_DIR / f"{slug}.json").relative_to(ROOT)),
                "seed": 260602 + index,
                "mode": "starter",
            }
        )
    return jobs


def manifest_jobs(path: Path, limit: int | None) -> list[dict[str, Any]]:
    manifest_path = path if path.is_absolute() else ROOT / path
    data = json.loads(manifest_path.read_text())
    images = data.get("images")
    if not isinstance(images, list):
        raise ValueError(f"Manifest missing images array: {manifest_path}")
    if limit is not None:
        images = images[:limit]
    jobs: list[dict[str, Any]] = []
    for item in images:
        slug = item["slug"]
        seed = item.get("seed")
        if not isinstance(seed, int):
            raise ValueError(f"Manifest image {slug} must include a deterministic integer seed.")
        jobs.append(
            {
                "slug": slug,
                "prompt": item["prompt"],
                "outputJpeg": item["outputJpeg"],
                "outputWebp": item["outputWebp"],
                "sidecar": item["sidecar"],
                "seed": seed,
                "negativePrompt": item.get("negativePrompt"),
                "manifest": str(manifest_path.relative_to(ROOT)),
                "title": item.get("title"),
                "ageBand": item.get("ageBand"),
                "seoLane": item.get("seoLane"),
                "sourceWorldFile": item.get("sourceWorldFile"),
                "mode": "manifest",
            }
        )
    return jobs


def outputs_exist(job: dict[str, Any]) -> bool:
    output_jpeg = ROOT / job["outputJpeg"]
    output_webp = ROOT / job["outputWebp"] if job.get("outputWebp") else None
    sidecar = ROOT / job["sidecar"]
    return output_jpeg.exists() and (output_webp is None or output_webp.exists()) and sidecar.exists()


def generate_job(
    pipe: Any,
    generator: Any,
    job: dict[str, Any],
    skip_existing: bool = False,
) -> dict[str, Any] | None:
    slug = job["slug"]
    prompt = job["prompt"]
    seed = job["seed"]
    output_jpeg = ROOT / job["outputJpeg"]
    output_webp = ROOT / job["outputWebp"] if job.get("outputWebp") else None
    sidecar_path = ROOT / job["sidecar"]
    negative_prompt = job.get("negativePrompt") or NEGATIVE_PROMPT
    if skip_existing and outputs_exist(job):
        print(f"Skipping {slug}; outputs already exist.")
        return None

    output_jpeg.parent.mkdir(parents=True, exist_ok=True)
    if output_webp:
        output_webp.parent.mkdir(parents=True, exist_ok=True)
    sidecar_path.parent.mkdir(parents=True, exist_ok=True)
    generator.manual_seed(seed)
    start = time.time()
    print(f"Generating {slug} ({WIDTH}x{HEIGHT}, {STEPS} steps, seed {seed})")
    image = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        width=WIDTH,
        height=HEIGHT,
        num_inference_steps=STEPS,
        guidance_scale=GUIDANCE,
        generator=generator,
    ).images[0]

    image.save(output_jpeg, "JPEG", quality=JPEG_QUALITY, optimize=True)
    if output_webp:
        image.save(output_webp, "WEBP", quality=WEBP_QUALITY, method=6)

    elapsed_seconds = round(time.time() - start, 2)
    sidecar = {
        "slug": slug,
        "prompt": prompt,
        "negativePrompt": negative_prompt,
        "model": "sd_xl_base_1.0.safetensors",
        "vae": SDXL_VAE_REPO,
        "width": WIDTH,
        "height": HEIGHT,
        "steps": STEPS,
        "guidance": GUIDANCE,
        "seed": seed,
        "jpegQuality": JPEG_QUALITY,
        "webpQuality": WEBP_QUALITY if output_webp else None,
        "outputJpeg": str(output_jpeg.relative_to(ROOT)),
        "outputWebp": str(output_webp.relative_to(ROOT)) if output_webp else None,
    }
    if job.get("mode") == "starter":
        sidecar["elapsedSeconds"] = elapsed_seconds
        sidecar["output"] = str(output_jpeg.relative_to(ROOT))
    for key in ["manifest", "title", "ageBand", "seoLane", "sourceWorldFile"]:
        if job.get(key):
            sidecar[key] = job[key]
    sidecar_path.write_text(
        json.dumps(
            sidecar,
            indent=2,
        )
        + "\n"
    )
    print(f"Saved {output_jpeg}")
    if output_webp:
        print(f"Saved {output_webp}")
    print(f"Saved {sidecar_path}")
    return sidecar


def main() -> None:
    args = parse_args()
    if args.manifest and (args.only or args.all):
        raise ValueError("Use either --manifest or starter --only/--all arguments, not both.")

    if args.manifest:
        validate_webp_support()
        jobs = manifest_jobs(args.manifest, args.limit)
    else:
        selected = sorted(PROMPTS) if args.all else (args.only or ["moon-muffin-market"])
        jobs = starter_jobs(selected)

    torch = load_torch()
    torch.cuda.empty_cache()
    pipe = load_pipeline()
    generator = torch.Generator(device="cuda")

    for job in jobs:
        generate_job(pipe, generator, job, skip_existing=args.skip_existing)


if __name__ == "__main__":
    main()
