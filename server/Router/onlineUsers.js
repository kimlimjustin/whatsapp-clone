const users = [];

const addUser = ({ id, email }) => {
    email = email.trim().toLowerCase();
  
    const existingUser = users.find((user) => user.email === email);
    
    if(!email) return { error: 'Email is required.' };
    if(existingUser) return { error: 'Username is taken.' };
  
    const user = { id, email };
  
    users.push(user);
  
    return { user };
}
  

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (email) => users.find((user)=> user.email === email);

module.exports = {addUser, removeUser, getUser, users};