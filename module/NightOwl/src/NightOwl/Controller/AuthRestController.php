<?php

/* 
 * This implements the AuthRestController. I'm using it to test unit testing.
 */

namespace NightOwl\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use NightOwl\Model\Auth;

class AuthRestController extends AbstractRestfulController
{
    protected $auth;
    
    public function __construct()
    {
        //parent::__construct();
        $this->auth = new Auth();
    }
    
    public function get($id)
    {
        if($this->params('method') === 'login')
        {
            $user = $id;
            $pass = $this->params('pw');
            
            return $this->login($user, $pass);
        }
        else if($this->params('method') === 'logout')
        {
            return $this->logout($id);
        }
        
    }
    
    private function login($user, $pass)
    {
        if($key = $this->auth->login($user, $pass))
        {
            return new \Zend\View\Model\JsonModel(array('status' => true, 'key'=> $key));
        }
        else 
        {
            $this->response->setStatusCode(401);
            return new \Zend\View\Model\JsonModel(array('status' => false));
        }
    }
    
    private function logout($key)
    {
        if($this->auth->logout($key))
        {
            return new \Zend\View\Model\JsonModel(array('status' => true));
        }
    }
    
    public function getList()
    {
        return new \Zend\View\Model\JsonModel(array('status' => false));
    }
    
    public function create($data)
    {
        
    }
    
    public function update($id, $data)
    {
        
    }
    
    public function delete($id)
    {
        
    }
}