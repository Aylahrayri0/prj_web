<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Sarah M.',
                'email' => 'sarah.m@example.com',
                'country' => 'France',
                'content' => 'Solidarité totale avec Gaza...',
                'rating' => 5,
                'approved' => false,
                'created_at' => '2024-11-15 10:00:00'
            ],
            [
                'name' => 'Ahmed K.',
                'email' => 'ahmed.k@example.com',
                'country' => 'Maroc',
                'content' => 'قلبي مع غزة. كل يوم، نرى قوة وإرادة هذا الشعب.',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-14 15:30:00'
            ],
            [
                'name' => 'Maria G.',
                'email' => 'maria.g@example.com',
                'country' => 'España',
                'content' => 'Gaza vivirá, Gaza vencerá. Su determinación es admirable. Que la paz regrese pronto.',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-13 09:15:00'
            ],
            [
                'name' => 'John P.',
                'email' => 'john.p@example.com',
                'country' => 'USA',
                'content' => 'Unconditional support for Gaza. Justice will prevail. Stay strong, we stand with you.',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-12 14:20:00'
            ],
            [
                'name' => 'Yasmine B.',
                'email' => 'yasmine.b@example.com',
                'country' => 'Tunisie',
                'content' => 'من كل قلبي مع غزة. كل سرع، كل دعاء له أهمية. لنسم وحدكم في هذه المحنة',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-11 11:45:00'
            ],
            [
                'name' => 'Mohamed A.',
                'email' => 'mohamed.a@example.com',
                'country' => 'México',
                'content' => 'Gaza vivirá, Gaza vencerá. Su determinación es admirable. Que la paz regrese pronto.',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-10 16:30:00'
            ],
            [
                'name' => 'Emma L.',
                'email' => 'emma.l@example.com',
                'country' => 'UK',
                'content' => 'My heart breaks for Gaza. Your strength and resilience inspire us all. We will never forget.',
                'rating' => 5,
                'approved' => true,
                'created_at' => '2024-11-09 13:10:00'
            ]
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}
