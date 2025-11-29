<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'country',
        'email',
        'content',
        'rating',
        'image_url',
        'approved',
    ];

    protected $casts = [
        'approved' => 'boolean',
    ];
}