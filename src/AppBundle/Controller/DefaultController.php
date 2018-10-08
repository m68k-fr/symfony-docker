<?php

namespace AppBundle\Controller;

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
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', array(
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).\DIRECTORY_SEPARATOR,
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
