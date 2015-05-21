<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace NightOwl\Model;

use NightOwl\Model\Auth;

/**
 * This is a model that can be used with the Audit collection in a mongoDB.
 * 
 * detailed parameters list of collection:
 * owner   - this is the user that edited the code.
 * code    - the DL code being changed.
 * time    - the time that the DLCode was changed.
 * message - the message about the change. This is set specficily by the
 *           entity that created it, this is intended to be a description of
 *           the change.
 */
class Audit extends BaseModel
{
    /**
     * @date May 3, 2015
     *
     * @author Marc Vouve
     *
     * @param array $query The Query to put to mongo. This is a read only
     * operation, nothing beyond the JSON object is required or will work.
     *
     * @return array an array of the results from Mongo. To give meaningful order
     * The resulting array is sorted by date desending.
     */
    public function getLog(array $query)
    {
        $cursor = $this->getDB()->ConsulAudit->find($query);
        $cursor->sort(array('date' => -1));

        $retval = array();

        if($cursor)
        {
            // transforms the cursor into an array.
            foreach ($cursor as $doc)
            {
                 $retval[] = $doc;
            }

            return $retval;
        }
        else
        {

            return null;
        }
    }


    /**
     * This method creates a Audit Log. The log has an associated message and code
     * which is assigned by the caller. there is a time and owner that are set based
     * on the session and current time.
     * 
     * @author Marc Vouve
     *
     * @date   May 3, 2015
     *
     * @param type $message The message to set in mongo.
     * @param type $code    The launch code that is being changed.
     * @return boolean      based in the mongo insertion's okay status.
     * 
     */
    public function LogEdit($message, $code)
    {
        // creates an new Authentification model (to get the current user).
        $auth = new Auth();
        $data = array('owner'   => $auth->getCurrentUser(),
                      'code'    => $code,
                      'time'    => date('Y-m-d H:i:s'),
                      'message' => $message);

        return (boolean) $this->getDB()->ConsulAudit->insert($data)["ok"];
    }
}
