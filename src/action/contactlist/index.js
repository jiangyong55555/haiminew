import ContactDao from "../../expand/dao/ContactDao";
import Types from '../types';
import Utils from '../../util/Utils';

const onLoadContactListAction = (contactlist) => ({
    type: Types.ONLOAD_CONTACT_LIST,
    contactlist: contactlist
});

/**
 * 加载数据
 * @returns {Function}
 */
export const onLoadContactList = () => {
    return (dispatch) => {
        const contactDao = new ContactDao();
        contactDao.fetchData().then((data) => {
            dispatch(onLoadContactListAction(data));
        })
    }
};

const addContactAction = (contact) => ({
    type: Types.ADD_CONTACT_LIST,
    contact: contact
});

/**
 * 添加数据
 * @param contact
 * @returns {Function}
 */
export const addContact = (contact) => {
    return (dispatch) => {
        const utils = new Utils;
        utils.checkContact(contact).then(judge=>{
            if(!judge){
                const contactDao = new ContactDao();
                contactDao.saveData([contact],[contact.account]);
                dispatch(addContactAction(contact));
            }
        });
    }
};
