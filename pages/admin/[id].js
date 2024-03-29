import { useState, useEffect } from 'react';
import { db } from '../../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore/lite';
import Link from 'next/link';
import DeleteMovie from '../../components/deleteMovie';
import { toast } from "react-toastify";
import Loading from '../../components/loading';
import styles from "../../styles/showmovie.module.scss";
import Carousels from '../../components/carousel';


import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "next/router"

const Movie = (props) => {
    const state = {
        name: '',
        tag: [],
        description: '',
        director: [],
        writers: [],
        stars: [],
        rating: '',
        poster: [],
        images: [],
        trailer: '',
        duration: '',
        release: Date,
        limit: '',
        active: Boolean
    }
    
    const [movie, setMovie] = useState(state);
    const [removeMovie, setRemoveMovie] = useState(false);
    const [loading, setLoading] = useState(false)

    const auth = getAuth()

    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (u) => {
                if(u){
                const us = await getDoc(doc(db, 'users', `${u.uid}`))
                const data = us.data()
                const last = Router.pathname.split("/")
                if(data.role == "user" && last[1] == "admin")
                    Router.push("/");
                }
            })
        } catch (error) {
            return toast.error(error.message)
        }
    }, [])

    useEffect(async () => {
        try {
            setLoading(true)
            const res = await getDoc(doc(db, 'movies', `${props.id}`))
            setMovie(res.data())
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }, [])

    return (
        <div className={styles.container}>
            {
                loading && <Loading />
            }
            <div className={styles.main_cont}>
                {/* <div className={styles.poster_cont}>
                    <img className={styles.poster} src={movie.images[0]} alt="poster" id="poster"/>
                </div> */}
                <div className={styles.details}>
                    <div className={styles.info}>
                        <div className={styles.title}>
                            <div className={styles.header}>
                                <h1 id="name">{movie.name}</h1>
                                {
                                    movie.active
                                    ? <h1 className={styles.active} id="active">✅</h1>
                                    : <h1 className={styles.active} id="active">❌</h1>
                                }
                            </div>
                            {/* <h1 id="limit" className={styles.limit}>{movie.limit}+</h1> */}
                        </div>
                        {/* <div className={styles.desc}>
                            <h1 id="description" className={styles.description}>{movie.description}</h1>
                        </div> */}
                        
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Link href={`/admin/updatemovie/${props.id}`}><a className={styles.update}>Update</a></Link>
                    <button onClick={() => setRemoveMovie(!removeMovie)} className={styles.delete}>Delete</button>
                    {
                        removeMovie &&
                        <DeleteMovie setRemoveMovie={setRemoveMovie} id={props.id} />
                    }
                </div>
            </div>
            {/* <div className={styles.about}>
                <h2>About Movie:</h2>
               
                <div className={styles.gall_main}>
                    <label htmlFor="image" className={styles.gall_label}>Images</label>
                    <div className={styles.car}>
                        <Carousels images={movie.images}/>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export async function getServerSideProps ({params: {id}}) {
    return { props: { id } };
}

export default Movie
