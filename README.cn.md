# Stable Diffusion on EKS

## 1. 构建镜像

下载 ComfyUI 到 comfyui_image 目录

通过在 Dockerfile 中使用 RUN 命令来安装 custom nodes 和依赖，需要先找到缺失的 custom nodes 的 Github 地址

```shell
region="us-west-2" # Modify the region to your current region.
cd ~/comfyui-on-eks/comfyui_image/ && bash build_and_push.sh $region Dockerfile
```
