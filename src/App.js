import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

function App() {
   const inputFile = useRef();
   const [imageUrl, setImageUrl] = useState([]);
   const [posts, setPosts] = useState([]);
   const [text, setText] = useState('');

   useEffect(() => {
      axios.get('http://localhost:3001/posts').then(({ data }) => {
         setImageUrl(data);
      });
   }, []);

   useEffect(() => {
      axios.get('http://localhost:3001/posts').then(({ data }) => {
         setPosts(data);
      });
   }, []);

   const handleChangeRef = async (event) => {
      try {
         const reader = new FileReader();
         const file = event.target.files.length;

         reader.onload = () => {
            if (file) {
               setImageUrl((prev) => [...prev, reader.result]);
            }
         };

         reader.readAsDataURL(event.target.files[0]);
      } catch (error) {
         alert(error);
      }
   };

   const removeImage = () => {
      if (imageUrl) {
         setImageUrl([]);
      }
   };

   const addPost = () => {
      const fields = {
         text,
         imageUrl,
      };

      axios.post('http://localhost:3001/posts', fields).then(() => {
         setPosts((prev) => [...prev, fields]);
      });
   };

   return (
      <div>
         {imageUrl && (
            <input ref={inputFile} type="file" onChange={handleChangeRef} />
         )}
         {imageUrl.map((image) => (
            <img width={100} src={image} alt="" />
         ))}
         <div>
            <input
               value={text}
               onChange={(e) => setText(e.target.value)}
               type="text"
               placeholder="Post"
            />
            <button onClick={addPost}>Add</button>
         </div>
         <div>{imageUrl && <button onClick={removeImage}>Remove</button>}</div>

         {posts.map((post) => (
            <div key={post.id}>
               <h3>{post.text}</h3>
               {Array.isArray(post.imageUrl) ? (
                  post.imageUrl.map((image) => (
                     <img width={200} src={image} alt="" />
                  ))
               ) : (
                  <img width={200} src={post.imageUrl} alt="" />
               )}
            </div>
         ))}
      </div>
   );
}

export default App;
