
/* This is a function that logs the user in 
function login() {
   let password = $('#password-input').val();
   let username = $('#username-input').val();

   fetch( "/login", {
      method : "POST",
      headers : { 
         "Content-type" : "application/json"
      },
      body : JSON.stringify( { username : username, password : password })
   } )
   .then( res => res.json() )
   .then( user => {
      authenticatedUser = user;
      updateUserProfile( user );
      updateItems();
      itemsView();
   } ).finally( () => {
      $("#password-input").val('');
      $("#username-input").val('');
   } );
}

/* This is a function that logs the user out 
function logout() {
   fetch( "/logout", { method : "POST "} )
   .then( loginView );
} */