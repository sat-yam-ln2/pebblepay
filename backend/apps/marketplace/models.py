from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

class Category(models.Model):
    """
    Categories for marketplace apps.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon identifier for the category")
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

class App(models.Model):
    """
    Applications available in the PebblePay marketplace.
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='apps', on_delete=models.CASCADE)
    developer = models.CharField(max_length=200)
    version = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00, 
                                validators=[MinValueValidator(0), MaxValueValidator(5)])
    downloads_count = models.PositiveIntegerField(default=0)
    screenshots = models.JSONField(default=list)
    icon = models.ImageField(upload_to='apps/icons/')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def update_rating(self):
        """Update the average rating based on reviews."""
        reviews = self.reviews.all()
        if reviews.exists():
            avg_rating = reviews.aggregate(models.Avg('rating'))['rating__avg']
            self.rating = round(avg_rating, 2)
            self.save(update_fields=['rating'])
    
    class Meta:
        ordering = ['-is_featured', 'name']

class AppReview(models.Model):
    """
    User reviews for marketplace apps.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='app_reviews')
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s review of {self.app.name}"
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        # Update app rating after saving a review
        self.app.update_rating()
    
    class Meta:
        unique_together = ('user', 'app')
        ordering = ['-created_at']

class AppInstallation(models.Model):
    """
    Tracks app installations by users.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='app_installations')
    app = models.ForeignKey(App, on_delete=models.CASCADE, related_name='installations')
    installed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.app.name} installed by {self.user.username}"
    
    class Meta:
        unique_together = ('user', 'app')
        ordering = ['-installed_at']
