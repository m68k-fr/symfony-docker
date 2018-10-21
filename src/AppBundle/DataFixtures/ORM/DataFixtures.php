<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\BlogCategory;
use AppBundle\Entity\BlogPost;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class DataFixtures implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create('fr_FR');

        // BlogCategory: generate 6 fake category
        for ($i = 0; $i < 6; ++$i) {
            $category = new BlogCategory();
            $category->setTitle(implode(' ', $faker->words()));
            $category->setOrdering($i + 1);
            $category->setActive(1);
            $manager->persist($category);

            // BlogPost: generate 5 to 10 fake articles in each category
            for ($j = 0; $j < mt_rand(5, 10); ++$j) {
                $post = new BlogPost();
                $post->setTitle($faker->sentence);
                $paragraphs = '<p>'.implode("</p>\n<p>", $faker->paragraphs(mt_rand(1, 6)))."</p>\n";
                $post->setCategory($category);
                $post->setContent($paragraphs);
                $post->setImageUrl('https://placeimg.com/640/480/tech');
                $post->setPostedAt($faker->dateTimeBetween('-3 months'));
                $post->setActive($faker->boolean);
                $manager->persist($post);
            }
        }

        $manager->flush();
    }
}
