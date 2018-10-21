<?php

namespace AppBundle\Controller;

use AppBundle\Entity\BlogCategory;
use AppBundle\Entity\BlogPost;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $repoBlogPost = $this->getDoctrine()->getRepository(BlogPost::class);
        $repoBlogCat = $this->getDoctrine()->getRepository(BlogCategory::class);

        $i = 0;
        $blocksBlog = array();
        $blogCategories = $repoBlogCat->findBy(array('active' => true), array('ordering' => 'ASC'), 3);
        foreach ($blogCategories as $blogCategory) {
            $blocksBlog[$i]['title'] = $blogCategory->getTitle();
            $blocksBlog[$i]['posts'] = $repoBlogPost->findBy(
                array('category' => $blogCategory->getId(), 'active' => 1),
                array('postedAt' => 'DESC'),
                3);
            ++$i;
        }

        return $this->render('default/index.html.twig', array(
            'blocks_blog' => $blocksBlog,
        ));
    }

    /**
     * @Route ("overview", name="overview")
     */
    public function overviewAction(Request $request)
    {
        return $this->render('default/overview.html.twig');
    }
}
