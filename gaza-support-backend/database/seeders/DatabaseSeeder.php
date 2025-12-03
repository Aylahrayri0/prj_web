<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DonationCategory;
use App\Models\Donation;
use App\Models\Article;
use App\Models\Testimonial;
use App\Models\ImpactStatics;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user if not exists
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            ['name' => 'Test User', 'password' => bcrypt('password')]
        );

        // Create donation categories
        $categories = [
            ['name' => 'Medical Aid', 'description' => 'Help for medical emergencies and healthcare'],
            ['name' => 'Food & Water', 'description' => 'Essential food and water supplies'],
            ['name' => 'Shelter', 'description' => 'Emergency shelter and housing'],
            ['name' => 'Education', 'description' => 'Educational support and resources'],
            ['name' => 'General Support', 'description' => 'General humanitarian assistance'],
        ];

        foreach ($categories as $category) {
            DonationCategory::firstOrCreate(
                ['name' => $category['name']],
                array_merge($category, ['description' => $category['description']])
            );
        }

        // Create sample donations
        Donation::create([
            'user_id' => $user->id,
            'category_id' => 1,
            'amount' => 100.00,
            'donor_name' => 'Ahmed Hassan',
            'donor_email' => 'ahmed@example.com',
            'message' => 'Please help those in need',
            'status' => 'completed',
        ]);

        Donation::create([
            'user_id' => null,
            'category_id' => 2,
            'amount' => 250.00,
            'donor_name' => 'Fatima Ali',
            'donor_email' => 'fatima@example.com',
            'message' => 'For food assistance',
            'status' => 'completed',
        ]);

        // Create sample articles
        Article::create([
            'user_id' => $user->id,
            'title' => 'Latest Updates on Relief Efforts',
            'content' => 'Our team has been working tirelessly to provide relief to affected communities. Here are the latest updates on our efforts.',
            'image_url' => 'https://via.placeholder.com/600x400',
            'category' => 'News',
        ]);

        Article::create([
            'user_id' => $user->id,
            'title' => 'How Your Donation Makes a Difference',
            'content' => 'Every donation, no matter the size, contributes to our mission of providing humanitarian aid.',
            'image_url' => 'https://via.placeholder.com/600x400',
            'category' => 'Impact',
        ]);

        // Create sample testimonials
        Testimonial::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah@example.com',
            'content' => 'This organization has truly made a difference in my life and my community. I am grateful for their support.',
            'rating' => 5,
            'image_url' => 'https://via.placeholder.com/100x100',
            'approved' => true,
        ]);

        Testimonial::create([
            'name' => 'Mohammed Rahman',
            'email' => 'mohammed@example.com',
            'content' => 'The team provided excellent assistance when we needed it most. Highly recommended.',
            'rating' => 5,
            'image_url' => 'https://via.placeholder.com/100x100',
            'approved' => true,
        ]);

        // Create impact statistics
        ImpactStatics::create([
            'metric_name' => 'Total Donations',
            'value' => 15000,
            'description' => 'Total amount donated to our cause',
        ]);

        ImpactStatics::create([
            'metric_name' => 'People Helped',
            'value' => 5000,
            'description' => 'Number of people assisted',
        ]);

        ImpactStatics::create([
            'metric_name' => 'Communities Reached',
            'value' => 25,
            'description' => 'Number of communities supported',
        ]);
    }
}
