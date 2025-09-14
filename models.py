import torch
import torch.nn as nn
import torchvision.models as models

class DotGridDetector(nn.Module):
    def __init__(self, pretrained=True):
        super(DotGridDetector, self).__init__()
        # Use a pretrained ResNet for feature extraction
        resnet = models.resnet18(pretrained=pretrained)
        self.features = nn.Sequential(*list(resnet.children())[:-2])
        
        # Add a custom head for dot grid detection
        self.detector_head = nn.Sequential(
            nn.Conv2d(512, 128, 3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(128, 64, 2, stride=2),
            nn.ReLU(),
            nn.ConvTranspose2d(64, 1, 2, stride=2),
            nn.Sigmoid()  # Output a probability map of dot locations
        )

    def forward(self, x):
        if x.shape[1] == 1: # if grayscale
            x = x.repeat(1, 3, 1, 1)
        features = self.features(x)
        return self.detector_head(features)

class StrokeSegmenter(nn.Module):
    def __init__(self, pretrained=True):
        super(StrokeSegmenter, self).__init__()
        # Use a pretrained DeepLabV3 model for segmentation
        self.model = models.segmentation.deeplabv3_resnet50(pretrained=pretrained, progress=True)
        # Modify the classifier for single-class segmentation (strokes)
        self.model.classifier[4] = nn.Conv2d(256, 1, kernel_size=(1, 1), stride=(1, 1))

    def forward(self, x):
        if x.shape[1] == 1: # if grayscale
            x = x.repeat(1, 3, 1, 1)
        return self.model(x)['out']