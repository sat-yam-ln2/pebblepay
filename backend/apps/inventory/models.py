from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.utils.text import slugify

class Category(models.Model):
    """
    Categories for inventory products.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='children')
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

class Product(models.Model):
    """
    Products in inventory for sale.
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, blank=True, null=True)
    
    stock_quantity = models.PositiveIntegerField(default=0)
    min_stock_level = models.PositiveIntegerField(default=5)
    max_stock_level = models.PositiveIntegerField(default=100)
    
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    weight = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True, help_text="Weight in grams")
    dimensions = models.JSONField(default=dict, blank=True, null=True, help_text="Dimensions in JSON format")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def is_low_stock(self):
        """Check if the product is low on stock."""
        return self.stock_quantity <= self.min_stock_level
    
    @property
    def profit_margin(self):
        """Calculate the profit margin percentage."""
        if self.cost_price == 0:
            return 0
        return ((self.price - self.cost_price) / self.cost_price) * 100
    
    def update_stock(self, quantity, movement_type='adjustment', reason='', user=None):
        """Update stock and create a stock movement record."""
        old_quantity = self.stock_quantity
        
        if movement_type == 'in':
            self.stock_quantity += quantity
        elif movement_type == 'out':
            if self.stock_quantity >= quantity:
                self.stock_quantity -= quantity
            else:
                raise ValueError("Cannot remove more stock than available")
        else:  # adjustment
            self.stock_quantity = quantity
        
        self.save(update_fields=['stock_quantity', 'updated_at'])
        
        # Create stock movement record
        StockMovement.objects.create(
            product=self,
            movement_type=movement_type,
            quantity=quantity if movement_type != 'adjustment' else self.stock_quantity - old_quantity,
            reason=reason,
            performed_by=user
        )
        
        return self.stock_quantity
    
    class Meta:
        ordering = ['name']

class StockMovement(models.Model):
    """
    Records of stock movements (in, out, adjustments).
    """
    MOVEMENT_CHOICES = (
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Stock Adjustment'),
    )
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_CHOICES)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True)
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.product.name} ({self.quantity})"
    
    class Meta:
        ordering = ['-created_at']
