<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace NightOwl\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

use Zend\View\Model\JsonModel;

use NightOwl\Model\Audit;
use NightOwl\Model\Auth;


/**
 * This controller handles the Audit functionality of Nightowl.
 * it is fairly basic as audits are created by other functions through the model.
 * at this point, only get list has any implementation.
 * 
 * @author Marc Vouve
 */
class AuditController extends AbstractRestfulController
{
    /**
     * @var Audit the Audit model.
     */
    protected $audit;
    /**
     *
     * @var Auth the Auth model.
     */
    protected $auth;

    /**
     * Default constructor init Audit, init Auth.
     * 
     * @author Marc Vouve
     */
    public function __construct()
    {
        $this->audit = new Audit();
        $this->auth = new Auth();
    }


    /**
     * Not implemented.
     * 
     * @param type $id
     */
    public function get($id)
    {

    }

    /**
     * This function can be accessed via the endpoint /audit/{query}
     * The query can be anything that's mongo complient, using JSON.
     * both the JSON Key and the JSON value MUST be surounded by double quotes.
     * 
     * if the query is invalid the controller will return a 400 status, and a empty array.
     * if no session is found the controller will return a 401 status.
     * otherwise the controller will return 200.
     * 
     * At the most recent revision of this header the expected key names are
     * 
     * owner   - this is the user that edited the code.
     * code    - the DL code being changed.
     * time    - the time that the DLCode was changed.
     * message - the message about the change. This is set specficily by the
     *           entity that created it, this is intended to be a description of
     *           the change.
     * 
     * @author Marc Vouve
     * 
     * @return JsonModel
     */
    public function getList()
    {
        $query = $this->params('query');
        
        if ($this->auth->auth())
        {
            $query = json_decode(urldecode($query), true);
            if(is_array($query))
            {
                return new JsonModel($this->audit->getLog($query));
            }
            else 
            {
                $this->response->setStatusCode(400);

                return new \Zend\View\Model\JsonModel(null);
            }

        }
        else
        {
            $this->response->setStatusCode(401);

            return new JsonModel(null);
        }
    }
    
    /**
     * Not implemented
     * 
     * @param type $id
     * @param type $data
     */
    public function update($id, $data)
    {

    }

    /**
     * Not implemented.
     * 
     * @param type $data
     */
    public function create($data)
    {

    }

    /**
     * Not implemented.
     * 
     * @param type $id
     */
    public function delete($id)
    {

    }
}
