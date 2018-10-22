<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;

class BlogController extends Controller
{
    /**
     * @Route(path="/blog", name="blog")
     */
    public function indexAction()
    {
        return $this->render('blog/index.html.twig', array(
            // ...
        ));
    }
}
