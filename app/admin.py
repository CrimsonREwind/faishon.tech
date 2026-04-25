from django.contrib import admin
from .models import UserProfile, Address, Post, Comment, Donation, MarketplaceProduct, Order


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number')
    search_fields = ('user__username', 'user__email')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'city', 'state', 'is_default', 'user')
    list_filter = ('is_default', 'state')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('user', 'clothing_type', 'quantity', 'condition', 'coins_earned', 'status', 'created_at')
    list_filter = ('status', 'donation_type', 'condition')
    list_editable = ('status',)
    search_fields = ('user__username', 'clothing_type')


@admin.register(MarketplaceProduct)
class MarketplaceProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'size', 'price_coins', 'stock', 'is_featured', 'created_at')
    list_filter = ('category', 'size', 'is_featured')
    list_editable = ('price_coins', 'stock', 'is_featured')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'image')
        }),
        ('Details', {
            'fields': ('category', 'size', 'price_coins', 'stock', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity', 'total_coins', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    list_editable = ('status',)
    search_fields = ('user__username', 'product__name')
    readonly_fields = ('created_at',)
