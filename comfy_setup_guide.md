# ComfyUI Local Setup Guide

Setting up ComfyUI locally will allow you to generate unlimited images and videos without AI credits, provided you have a decent GPU (NVIDIA recommended).

## 1. Installation

1. **Download ComfyUI Portable**: [Get it here](https://github.com/comfyanonymous/ComfyUI/releases/latest/download/ComfyUI_windows_portable_nvidia_cu121_or_cpu.7z).
2. **Extract**: Use 7-Zip or WinRAR to extract the folder to a drive with at least 50GB of free space.
3. **Run**: Double-click `run_nvidia_gpu.bat` to start.

## 2. Essential Model Downloads

Place these files in the `ComfyUI/models/` subfolders:

### Base Model (Checkpoints)

*Store in: `ComfyUI/models/checkpoints/`*

- **SDXL 1.0 Base**: [Download from HuggingFace](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors)

### LoRAs (Style Models)

*Store in: `ComfyUI/models/loras/`*

- **Henri Matisse Style**: Search Civitai for "Henri Matisse SDXL" or use [this link](https://civitai.com/models/125867/henri-matisse-sdxl-10-art-style-lora). (Trigger: `m4t1`)
- **Anime Style**: Search Civitai for "Pastel Anime SDXL" or "Animagine Style".
- **Studio Ghibli Style**: Search Civitai for "Studio Ghibli SDXL".

### ControlNet (For your Sketches)

*Store in: `ComfyUI/models/controlnet/`*

- **Scribble SDXL**: [Download here](https://huggingface.co/xinsir/controlnet-scribble-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors) (Rename to `controlnet-scribble-sdxl.safetensors`).

### Video and Animation (Crucial for MP4)

*Store in: `ComfyUI/custom_nodes/`*

- **VideoHelperSuite**: Confirm you have `ComfyUI-VideoHelperSuite` installed via Manager. This provides the `VHS_VideoCombine` node.
- **AnimateDiff-Evolved**: Confirm you have `ComfyUI-AnimateDiff-Evolved` installed. This provides the `ADE_AnimateDiffLoaderGen1` node.

### Motion Module (For Video)

*Store in: `ComfyUI/models/animatediff_models/` (or its specific custom node folder)*

- **Motion Module**: `mm_sdxl_v10_beta.ckpt`. Search HuggingFace for SDXL motion modules compatible with AnimateDiff-Evolved.

## 3. Install ComfyUI Manager

This is critical for automatic node installation.

1. Open a terminal in `ComfyUI/custom_nodes/`.
2. Run: `git clone https://github.com/ltdrdata/ComfyUI-Manager.git`
3. Restart ComfyUI.

## 4. Loading the Workflow

1. Drag and drop the `comfy_workflow.json` I provided into the ComfyUI browser window.
2. Click **"Manager"** -> **"Install Missing Custom Nodes"** if any nodes appear red.
3. Upload your sketch into the "Load Image" node.
4. Adjust the weight of the Matisse LoRA to 0.6, Anime to 0.3, and Ghibli to 0.1 in the LoRA Stacker nodes.
5. Click **"Queue Prompt"**.
