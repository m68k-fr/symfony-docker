<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class BlogController extends Controller
{
    /**
     * @Route("/blog")
     */
    public function indexAction()
    {
        return $this->render('blog/index.html.twig', array(
            // ...
        ));
    }

}
