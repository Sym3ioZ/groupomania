import '../../styles/style.css'

function Login() {
  // document.getElementById('LoginTab').className = 'ActiveTab'
  async function Signup(e) {
    e.preventDefault()
    const email = await document.getElementById('mail').value
    const pass = await document.getElementById('pwd').value
    console.log(email)
    console.log(pass)
    const inputs = {
      mail: email,
      password: pass,
    }
    console.log(inputs)
    const postOrder = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputs),
    }
    console.log(postOrder)
    const post = await fetch('http://localhost:3000/api/signup', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    console.log(post)
    document.location.assign('/home')
  }

  return (
    <div className="Body">
      <h1 className="Maintitle">
        Bienvenue sur le réseau social interne de l'entreprise GROUPOMANIA
      </h1>
      <div className="Login">
        <div className="Tabs">
          <div className="ActiveTab" id="LoginTab">
            CONNEXION
          </div>
          <div className="InactiveTab" id="SigninTab">
            INSCRIPTION
          </div>
        </div>

        <form className="Loginform">
          <div className="Textarea">
            <label htmlFor="mail">Adresse mail</label>
            <input type="email" id="mail" name="user_mail" />
          </div>
          <div className="Textarea">
            <label htmlFor="pwd">Mot de passe</label>
            <input type="text" id="pwd" name="user_pwd" />
          </div>
          <div className="Buttons">
            <input
              type="submit"
              className="Button"
              value="SE CONNECTER"
              id="signin"
              onClick={Signup}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
