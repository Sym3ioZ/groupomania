import '../../App.css'

function Login() {
  return (
    <div>
      <h1 className="Maintitle">
        Bienvenue sur le réseau social inter de l'entreprise GROUPOMANIA
      </h1>
      <div className="Login">
        <form className="Loginform" action="/" method="POST">
          <div className="Textarea">
            <label htmlFor="mail">Adresse mail</label>
            <input type="email" id="mail" name="user_mail"></input>
          </div>
          <div className="Textarea">
            <label htmlFor="pwd">Mot de passe</label>
            <input type="text" id="pwd" name="user_pwd"></input>
          </div>
          <div className="Buttons">
            <button type="submit" className="Button" id="signin" name="signin">
              CONNEXION
            </button>
            <button type="submit" className="Button" id="signup" name="signup">
              INSCRIPTION
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
