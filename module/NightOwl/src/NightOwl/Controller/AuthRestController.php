<?php

/*
 * This implements the AuthRestController. I'm using it to test unit testing.
 */

namespace NightOwl\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use \Zend\View\Model\JsonModel;
use NightOwl\Model\Auth;

class AuthRestController extends AbstractRestfulController
{
    /**
     *
     * @var Auth
     */
    protected $auth;

    public function __construct()
    {
        $this->auth = new Auth();
    }
    
    /**
     * this doesn't do anything but for legacy reasons it returns something
     * 
     * @date May, 13 2015
     * 
     * @param type $id
     * @return JsonModel
     */
    public function get($id)
    {
        $this->response->setStatusCode(401);
        return new \Zend\View\Model\JsonModel();
    }

    /**
     * this doesn't do anything but for legacy reasons it returns something
     * 
     * @date May, 13 2015
     * 
     * @param type $id
     * @return JsonModel
     */
    public function getList()
    {
        $this->response->setStatusCode(401);
        return new \Zend\View\Model\JsonModel();
    }

    /**
     * This function has two main paths depending on selected method.
     * if 'create' is selected in the URL, it parses the data and attempts to create
     * an account using the $this->createUser(); if 'login' is called it attempts to
     * login and create a cookie by calling $this->login.
     * 
     * @param type $data
     * @return JsonModel
     */
    public function create($data)
    {

        if($this->params('method') === 'login')
        {
            return $this->login($data);
        }
        if($this->params('method') === 'create')
        {
            return $this->createUser($data);
        }
    }

    /**
     * this is a helper function to create a user. on failure it return a 409 status.
     * on success it returns 200.
     * 
     * @date May 13, 2015
     * 
     * @param type $data data pased by post.
     * @return JsonModel success or failure (not overly useful validated of the status.)
     */
    protected function createUser($data)
    {
        $name = $data['name'];
        $pass = $data['pass'];

        // attempt to create an account via the model.
        $created = $this->auth->create_account($name, $pass);

        if($created)
        {
            return new JsonModel(array('success' => true));
        }
        else
        {
            // set status code to indicate a conflict.
            $this->response->setStatusCode(409);
            return new JsonModel(array('success' => false));
        }
    }

    /**
     * Authentificates the username and password using the Auth model.
     * if the username is invalid returns 401.
     * 
     * @date May, 13 2015
     * 
     * @param type $data
     * @return JsonModel
     */
    protected function login($data)
    {
        if(!isset($data['name']) || !isset($data['pass']))
        {
            // invalid request, no username or pass.
            $this->response->setStatusCode(400);
            return new \Zend\View\Model\JsonModel(array('status' => false));
        }

        $name = $data['name'];
        $pass = $data['pass'];

        // attempt to authentificate user.
        if($key = $this->auth->login($name, $pass))
        {
            $this->response->setStatusCode(201);
            return new \Zend\View\Model\JsonModel(array('status' => true, 'key'=> $key));
        }
        else
        {
            // user was not authentificated.
            $this->response->setStatusCode(401);
            return new JsonModel(array());
        }
    }

    public function update($id, $data)
    {

    }

    /**
     * Logs the user out.
     * 
     * @return JsonModel
     */
    public function deleteList()
    {
        if($this->params('method') === 'logout')
        {
            return new JsonModel(array('success' => $this->auth->logout()));
        }

        return new JsonModel(array());
    }
}
