import '../../App.css'

function Login() {
  async function Click() {
    const result = await fetch('http://localhost:3000/api')
      .then((res) => res.json())
      .catch((err) => err.json())

    console.log(result.message)
  }

  async function OnClick(e) {
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
    const post = await fetch('http://localhost:3000/api/test', postOrder)
      .then((res) => res.json())
      .catch((error) => console.log(error))

    console.log(post)
    document.location.assign(`/test/${post.message}`)
  }

  return (
    <div>
      <h1 className="Maintitle">
        Bienvenue sur le réseau social interne de l'entreprise GROUPOMANIA
      </h1>
      <div className="Login">
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
              value="CONNEXION"
              id="signin"
              onClick={OnClick}
            />
            <input
              type="submit"
              className="Button"
              value="INSCRIPTION"
              id="signup"
            />
          </div>
        </form>
        <div className="btn" onClick={Click}>
          TEST GET
        </div>
      </div>
    </div>
  )
}

export default Login
