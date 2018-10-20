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

        // BlogCategory: generate 5 fake category

        for ($i = 0; $i < 5; ++$i) {
            $category = new BlogCategory();
            $category->setTitle(implode(" ",$faker->words()));
            $category->setOrdering($i + 1);
            $category->setActive(1);
            $manager->persist($category);


            // BlogPost: generate 5 fake articles in each category
            for ($j = 0; $j < 5; ++$j) {
                $post = new BlogPost();
                $post->setTitle($faker->sentence);

                $paragraphs = "";
                foreach ($faker->paragraphs() as $paragraph) {
                    $paragraphs .=  "<p>".$paragraph."</p>\n";
                }
                $post->setCategory($category);
                $post->setContent($paragraphs);
                $post->setImageUrl("https://placeimg.com/640/480/tech");
                $post->setPostedAt($faker->dateTime);
                $post->setActive($faker->boolean);
                $manager->persist($post);
            }
        }

        $manager->flush();
    }
}
