from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify

class Feature(models.Model):
    """
    Features that can be assigned to devices.
    """
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, null=True, help_text="Icon identifier, e.g., 'bluetooth', 'wifi'")
    
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Device(models.Model):
    """
    PebblePay hardware devices available for purchase.
    """
    TYPE_CHOICES = (
        ('mini', 'PebblePay Mini'),
        ('flex', 'PebblePay Flex'),
        ('station', 'PebblePay Station'),
    )
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    model_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    description = models.TextField()
    specifications = models.JSONField(default=dict, help_text="Technical specifications as JSON")
    main_image = models.ImageField(upload_to='devices/', blank=True, null=True)
    features = models.ManyToManyField(Feature, related_name='devices', blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_model_type_display()})"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['name']

class DeviceImage(models.Model):
    """
    Additional images for device displays.
    """
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='devices/')
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Image for {self.device.name}"
    
    class Meta:
        ordering = ['display_order']
