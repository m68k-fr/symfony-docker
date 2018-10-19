<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\Article;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class DataFixtures implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {

        $faker = Faker\Factory::create('fr_FR');

        // create 20 fake articles
        for ($i = 1; $i < 21; ++$i) {
            $article = new Article();
            $article->setTitle($faker->sentence);

            $paragraphs = "";
            foreach ($faker->paragraphs() as $paragraph) {
                $paragraphs .=  "<p>".$paragraph."</p>\n";
            }
            $article->setContent($paragraphs);
            $article->setPostedAt($faker->dateTime);
            $article->setActive($faker->boolean);
            $manager->persist($article);
        }
        $manager->flush();
    }
}
