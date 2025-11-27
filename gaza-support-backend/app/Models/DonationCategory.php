<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function donations()
    {
        return $this->hasMany(Donation::class, 'category_id');
    }

    public function totalDonated(): float
    {
        return $this->donations()
            ->where('status', 'completed')
            ->sum('amount');
    }
}