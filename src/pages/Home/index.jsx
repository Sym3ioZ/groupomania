import { useEffect, useState } from 'react'
import '../../styles/style.css'

function Home() {
  const [allPosts, setAllPosts] = useState([])

  // GET every posts
  useEffect(() => {
    const fetchPosts = async () => {
      const fetchData = await fetch('http://localhost:3000/api/posts')
      const jsonData = await fetchData.json()
      setAllPosts(jsonData.resp)
    }
    fetchPosts()
  }, [])

  // Retrieving the selected picture
  const [selectedFile, setSelectedFile] = useState()

  const picChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  // POST to publish a post, then reload page
  async function Post(e) {
    e.preventDefault()

    // Declaring formdata to send via fetch
    const formData = new FormData()

    formData.append('image', selectedFile)

    const text = document.getElementById('text').value

    const inputs = {
      userId: 9,
      text: text,
    }

    formData.append('userId', inputs.userId)
    formData.append('text', inputs.text)

    const postOrder = {
      method: 'POST',
      body: formData,
    }
    console.log(postOrder)
    await fetch('http://localhost:3000/api/posts/post', postOrder)
      .then((res) => res.json())
      .catch((err) => console.log(err))
    document.location.assign('/home')
  }

  return (
    <div>
      <h1 className="maintitle">Page d'accueil</h1>
      <div className="postBlock">
        <input type="text" id="text"></input>
        <input
          type="file"
          name="image"
          className="image"
          onChange={picChange}
        />
        <input
          type="submit"
          className="button unlocked"
          value="PARTAGER"
          id="post"
          onClick={Post}
        />
      </div>
      <div className="maincontent" id="main-content">
        {allPosts?.map((publish) => {
          return (
            <div key={`${publish.id}`} className="post">
              {publish.user_id} <br />
              {publish.text} <br />
              <img src={publish.imageUrl} alt="postPicture" /> <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
