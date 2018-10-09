<?php

namespace AppBundle\DataFixtures\ORM;

use AppBundle\Entity\Article;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class DataFixtures implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        // create 20 fake articles
        for ($i = 1; $i < 21; ++$i) {
            $article = new Article();
            $article->setTitle('article '.$i);
            $article->setContent('article '.$i);
            $article->setPostedAt(new \DateTime('now'));
            $article->setActive(true);
            $manager->persist($article);
        }

        $manager->flush();
    }
}
