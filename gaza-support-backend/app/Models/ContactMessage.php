<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'country',
        'message',
        'status',
        'is_pinned'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
