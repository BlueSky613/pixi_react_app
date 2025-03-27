import {
    Assets,
    loadTextures,
    Texture,
    TextureMatrix,
} from 'pixi.js';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTick } from '@pixi/react';
import { collection, getDocs, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export function BunnySprite() {
    // The Pixi.js `Sprite`
    const spriteRef = useRef(null)

    const [texture, setTexture] = useState(Texture.EMPTY)
    const [diceTexture, setDiceTexture] = useState(null)

    const [hero1, setHero1] = useState(Texture.EMPTY)
    const [hero2, setHero2] = useState(Texture.EMPTY)
    const [hero3, setHero3] = useState(Texture.EMPTY)
    const [hero4, setHero4] = useState(Texture.EMPTY)

    const [hero11, setHero11] = useState(Texture.EMPTY)
    const [hero12, setHero12] = useState(Texture.EMPTY)
    const [hero13, setHero13] = useState(Texture.EMPTY)
    const [hero14, setHero14] = useState(Texture.EMPTY)

    const [isActive, setIsActive] = useState([false, false, false, false])

    const [pace, setPace] = useState(0)
    // const [location, setLocation] = useState([1, 1, 1, 1])
    const [isDice, setIsDice] = useState(false)

    const [rotation, setRotation] = useState(0)
    const [data, setData] = useState([]);
    const [heroOrder, setHeroOrder] = useState(0)

    const [positionX, setPositionX] = useState([25, 25, 50, 50]);
    const [positionY, setPositionY] = useState([500, 530, 500, 530]);

    const firstLocation = [[25, 500], [25, 530], [50, 500], [50, 530]]

    function getRandomNumber() {
        const min = 1;
        const max = 6;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var count = 0

    const animateRotation = useCallback(() => setRotation(previousState => previousState + 0.1), [])

    const animateDice = useCallback(() => {
        const number = getRandomNumber()
        if (isDice == true && count <= 100) {
            count++;
            Assets
                .load(`/image/dice_blak${number}.png`)
                .then((result) => {
                    setDiceTexture(result)
                })
            setPace(number)
        }
        else {
            setIsDice(false)
            count = 0;
        }
    }, [isDice, isActive])

    var countPace = 0;

    // async function addDocument() {
    //     try {
    //       // Create a document with a specified ID
    //       await setDoc(doc(db, 'room', 'user2'), {
    //         user: 'jupiter',
    //         hero: 1,
    //         location : [1,1,1,1],
    //         pace: 6,
    //         positionX: [25,25,50,50],
    //         positionY: [500,530,500,530]
    //       });
    //       console.log('Document successfully written!');
    //     } catch (error) {
    //       console.error('Error writing document: ', error);
    //     }
    //   }

    const updateDocument = async (updatedData, user) => {
        // Reference the document you want to update
        const docRef = doc(db, 'room', user);
        try {
            // Update the document with new data
            await updateDoc(docRef, updatedData);
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    useEffect(() => {
        // Set up snapshot listener for real-time updates
        const unsubscribe = onSnapshot(
            collection(db, 'room'),
            (querySnapshot) => {
                const docsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setData(docsArray);
            },
            (error) => {
                console.error("Error fetching real-time data: ", error);
            }
        );

        // Clean up the listener on component unmount
        return () => {
            unsubscribe();
        };
    }, [db]);

    useEffect(() => {
        const updatedData = {
            positionX: positionX,
            positionY: positionY
        };
        updateDocument(updatedData, 'user1');
    }, [positionX, positionY])

    useEffect(() => {
        const order = isActive.indexOf(true);
        if (order !== -1) {
            const item = data.find(item => item.id === "user1")
            var tmp = item['location'];
            if (!(item['positionX'][order] == firstLocation[order][0] && item['positionY'][order] == firstLocation[order][1])) {
                tmp = item['location'].map((num, index) => {
                    return index === order ? num + pace : num;
                })
            }
            const updatedData = {
                hero: order,
                pace: pace,
                location: tmp,
                active: true
            };
            updateDocument(updatedData, 'user1');
            setPositionX(data[0]['positionX']);
            setPositionY(data[0]['positionY']);

        }
    }, [isActive])

    const animateY = useCallback(() => {
        if (data.length !== 0) {
            if (data[0]['active'] == true && isActive.indexOf(true) !== -1) {
                const order = data[0]['hero']
                if (data[0]['positionX'][data[0]['hero']] == firstLocation[data[0]['hero']][0] && data[0]['positionY'][data[0]['hero']] == firstLocation[data[0]['hero']][1]) {
                    if (data[0]['pace'] == 6) {
                        setPositionX(previousState => {
                            var newState = [...previousState];
                            newState[order] = 265
                            return newState
                        })
                        setPositionY(previousState => {
                            var newState = [...previousState];
                            newState[order] = 530
                            return newState
                        })
                        setIsActive([false, false, false, false])
                    }
                }
                else {
                    setPositionY(previousState => {
                        if (data[0]['location'][data[0]['hero']] < 6) {
                            if (countPace <= 38 * data[0]['pace']) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] -= 2
                                return newState
                            }
                            if (countPace > 38 * data[0]['pace']) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace < 6 && data[0]['location'][data[0]['hero']] >= 6) {
                            if (countPace <= 38 * (pace + 1)) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (6 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * (pace + 1)) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] < 12) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] > 11 && data[0]['location'][data[0]['hero']] < 14) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (11 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] - pace < 11) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (11 - data[0]['location'][data[0]['hero']] + pace)) {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                } else if (countPace > 38 * (11 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (13 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState;
                                } else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 11 && data[0]['location'][data[0]['hero']] < 14) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] -= 2
                                return newState
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 11 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] < 19) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (13 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 13 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] < 19) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace > 13 && data[0]['location'][data[0]['hero']] >= 19 && data[0]['location'][data[0]['hero']] - pace < 19) {
                            if (countPace <= 38 * (pace + 1)) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (19 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * (pace + 1)) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }

                        if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] < 25) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] -= 2
                                return newState;
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] > 24 && data[0]['location'][data[0]['hero']] < 27) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (24 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] - pace < 24) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (24 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState;
                                } else if (countPace > 38 * (24 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (26 - data[0]['location'][data[0]['hero']] + pace)) {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                } else {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState;

                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 24 && data[0]['location'][data[0]['hero']] < 27) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 24 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] < 32) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (26 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 26 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] < 32) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] += 2
                                return newState
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace > 26 && data[0]['location'][data[0]['hero']] >= 32 && data[0]['location'][data[0]['hero']] - pace < 32) {
                            if (countPace <= 38 * (pace + 1)) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (32 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * (pace + 1)) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }

                        if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] < 38) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] > 37 && data[0]['location'][data[0]['hero']] < 40) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (37 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] - pace < 37) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (37 - data[0]['location'][data[0]['hero']] + pace)) {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] += 2
                                        return newState
                                    })
                                } else if (countPace > 38 * (24 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (39 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState;
                                } else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 37 && data[0]['location'][data[0]['hero']] < 40) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] += 2
                                return newState
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 37 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] < 45) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (39 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 39 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] < 45) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace > 39 && data[0]['location'][data[0]['hero']] >= 45 && data[0]['location'][data[0]['hero']] - pace < 45) {
                            if (countPace <= 38 * (pace + 1)) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (45 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * (pace + 1)) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }

                        if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] < 51) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] += 2
                                return newState
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] > 50 && data[0]['location'][data[0]['hero']] < 52) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (50 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState
                                }
                                else {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] - pace < 50) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (50 - data[0]['location'][data[0]['hero']] + pace)) {
                                    var newState = [...previousState];
                                    newState[order] += 2
                                    return newState;
                                } else if (countPace > 38 * (50 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (51 - data[0]['location'][data[0]['hero']] + pace)) {
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                } else {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState;
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 50 && data[0]['location'][data[0]['hero']] < 52) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                setPositionX(previousState => {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                })
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 50 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] < 57) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                if (countPace <= 38 * (51 - data[0]['location'][data[0]['hero']] + pace))
                                    setPositionX(previousState => {
                                        var newState = [...previousState];
                                        newState[order] -= 2
                                        return newState
                                    })
                                else {
                                    var newState = [...previousState];
                                    newState[order] -= 2
                                    return newState
                                }
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        if (data[0]['location'][data[0]['hero']] - pace >= 51 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] < 57) {
                            if (countPace <= 38 * pace) {
                                countPace = countPace + 2
                                var newState = [...previousState];
                                newState[order] -= 2
                                return newState
                            }
                            if (countPace > 38 * pace) {
                                setIsActive([false, false, false, false])
                                countPace = 0;
                            }
                        }
                        return previousState
                    })
                }
            }
        }
    }, [isActive])
    // const order = isActive.indexOf(true);
    // if (order !== -1) {
    //     setHeroOrder(order);
    //     if (positionX[order] == firstLocation[order][0] && positionY[order] == firstLocation[order][1]) {
    //         if (pace == 6) {
    //             setPositionX(previousState => {
    //                 var newState = [...previousState];
    //                 newState[order] = 265
    //                 return newState
    //             })
    //             setPositionY(previousState => {
    //                 var newState = [...previousState];
    //                 newState[order] = 530
    //                 return newState
    //             })
    //         }
    //     }
    //     else {
    //         tmp = location.map((num, index) => {
    //             return index === order ? num + pace : num;
    //         })
    //         setLocation(tmp)
    //         setPositionY(previousState => {
    //             if (data[0]['location'][data[0]['hero']] < 6) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] -= 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace < 6 && data[0]['location'][data[0]['hero']] >= 6) {
    //                 if (countPace <= 38 * (pace + 1)) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (6 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * (pace + 1)) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] < 12) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] > 11 && data[0]['location'][data[0]['hero']] < 14) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (11 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 6 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] - pace < 11) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (11 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     } else if (countPace > 38 * (11 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (13 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState;
    //                     } else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 11 && data[0]['location'][data[0]['hero']] < 14) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] -= 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 11 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] < 19) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (13 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 13 && data[0]['location'][data[0]['hero']] > 13 && data[0]['location'][data[0]['hero']] < 19) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace > 13 && data[0]['location'][data[0]['hero']] >= 19 && data[0]['location'][data[0]['hero']] - pace < 19) {
    //                 if (countPace <= 38 * (pace + 1)) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (19 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * (pace + 1)) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }

    //             if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] < 25) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] -= 2
    //                     return newState;
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] > 24 && data[0]['location'][data[0]['hero']] < 27) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (24 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 19 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] - pace < 24) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (24 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState;
    //                     } else if (countPace > 38 * (24 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (26 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     } else {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState;

    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 24 && data[0]['location'][data[0]['hero']] < 27) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 24 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] < 32) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (26 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 26 && data[0]['location'][data[0]['hero']] > 26 && data[0]['location'][data[0]['hero']] < 32) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] += 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace > 26 && data[0]['location'][data[0]['hero']] >= 32 && data[0]['location'][data[0]['hero']] - pace < 32) {
    //                 if (countPace <= 38 * (pace + 1)) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (32 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * (pace + 1)) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }

    //             if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] < 38) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] > 37 && data[0]['location'][data[0]['hero']] < 40) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (37 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 32 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] - pace < 37) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (37 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] += 2
    //                             return newState
    //                         })
    //                     } else if (countPace > 38 * (24 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (39 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState;
    //                     } else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 37 && data[0]['location'][data[0]['hero']] < 40) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] += 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 37 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] < 45) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (39 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 39 && data[0]['location'][data[0]['hero']] > 39 && data[0]['location'][data[0]['hero']] < 45) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace > 39 && data[0]['location'][data[0]['hero']] >= 45 && data[0]['location'][data[0]['hero']] - pace < 45) {
    //                 if (countPace <= 38 * (pace + 1)) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (45 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * (pace + 1)) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }

    //             if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] < 51) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] += 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] > 50 && data[0]['location'][data[0]['hero']] < 52) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (50 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState
    //                     }
    //                     else {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 45 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] - pace < 50) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (50 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         var newState = [...previousState];
    //                         newState[order] += 2
    //                         return newState;
    //                     } else if (countPace > 38 * (50 - data[0]['location'][data[0]['hero']] + pace) && countPace <= 38 * (51 - data[0]['location'][data[0]['hero']] + pace)) {
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     } else {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState;
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 50 && data[0]['location'][data[0]['hero']] < 52) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     setPositionX(previousState => {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     })
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 50 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] < 57) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     if (countPace <= 38 * (51 - data[0]['location'][data[0]['hero']] + pace))
    //                         setPositionX(previousState => {
    //                             var newState = [...previousState];
    //                             newState[order] -= 2
    //                             return newState
    //                         })
    //                     else {
    //                         var newState = [...previousState];
    //                         newState[order] -= 2
    //                         return newState
    //                     }
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             if (data[0]['location'][data[0]['hero']] - pace >= 51 && data[0]['location'][data[0]['hero']] > 51 && data[0]['location'][data[0]['hero']] < 57) {
    //                 if (countPace <= 38 * pace) {
    //                     countPace = countPace + 2
    //                     var newState = [...previousState];
    //                     newState[order] -= 2
    //                     return newState
    //                 }
    //                 if (countPace > 38 * pace) {
    //                     setIsActive([false, false, false, false])
    //                     countPace = 0;
    //                 }
    //             }
    //             return previousState
    //         })
    //     }
    // }


    useTick(animateRotation)
    useTick(animateY)
    useTick(animateDice)

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets
                .load('/image/ludo_board2.png')
                .then((result) => {
                    setTexture(result)
                });
            Assets
                .load('/image/ludo_hero2.png')
                .then((result) => {
                    setHero1(result)
                });
            Assets
                .load('/image/ludo_hero2.png')
                .then((result) => {
                    setHero2(result)
                });
            Assets
                .load('/image/ludo_hero2.png')
                .then((result) => {
                    setHero3(result)
                });
            Assets
                .load('/image/ludo_hero2.png')
                .then((result) => {
                    setHero4(result)
                });
            Assets
                .load('/image/ludo_hero.png')
                .then((result) => {
                    setHero11(result)
                });
            Assets
                .load('/image/ludo_hero.png')
                .then((result) => {
                    setHero12(result)
                });
            Assets
                .load('/image/ludo_hero.png')
                .then((result) => {
                    setHero13(result)
                });
            Assets
                .load('/image/ludo_hero.png')
                .then((result) => {
                    setHero14(result)
                });
        }
    }, [texture, hero1, hero2, hero3, hero4, hero11, hero12, hero13, hero14]);

    return (
        <>
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={texture}
                onClick={() => setIsDice(!isDice)}
                width={600}
                height={600}
                rotation={Math.PI}
                x={300}
                y={300} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={diceTexture}
                width={100}
                height={100}
                x={300}
                y={300} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive([true, false, false, false])}
                texture={hero1}
                width={25}
                height={60}
                x={data.length == 0 ? 25 : data[0]['positionX'][0] != null ? data[0]['positionX'][0] : 25}
                y={data.length == 0 ? 500 : data[0]['positionY'][0] != null ? data[0]['positionY'][0] : 500} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive([false, true, false, false])}
                texture={hero2}
                width={25}
                height={60}
                x={data.length == 0 ? 25 : data[0]['positionX'][1] != null ? data[0]['positionX'][1] : 25}
                y={data.length == 0 ? 530 : data[0]['positionY'][1] != null ? data[0]['positionY'][1] : 530} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive([false, false, true, false])}
                texture={hero3}
                width={25}
                height={60}
                x={data.length == 0 ? 50 : data[0]['positionX'][2] != null ? data[0]['positionX'][2] : 50}
                y={data.length == 0 ? 500 : data[0]['positionY'][2] != null ? data[0]['positionY'][2] : 500} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive([false, false, false, true])}
                texture={hero4}
                width={25}
                height={60}
                x={data.length == 0 ? 50 : data[0]['positionX'][3] != null ? data[0]['positionX'][3] : 50}
                y={data.length == 0 ? 530 : data[0]['positionY'][3] != null ? data[0]['positionY'][3] : 530} />

            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={hero11}
                width={25}
                height={60}
                x={data.length == 0 ? 550 : data[1]['positionX'][0] != null ? data[1]['positionX'][0] : 550}
                y={data.length == 0 ? 100 : data[1]['positionY'][0] != null ? data[1]['positionY'][0] : 100} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={hero11}
                width={25}
                height={60}
                x={data.length == 0 ? 550 : data[1]['positionX'][1] != null ? data[1]['positionX'][1] : 550}
                y={data.length == 0 ? 70 : data[1]['positionY'][1] != null ? data[1]['positionY'][1] : 70} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={hero11}
                width={25}
                height={60}
                x={data.length == 0 ? 575 : data[1]['positionX'][2] != null ? data[1]['positionX'][2] : 575}
                y={data.length == 0 ? 100 : data[1]['positionY'][2] != null ? data[1]['positionY'][2] : 100} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                texture={hero11}
                width={25}
                height={60}
                x={data.length == 0 ? 575 : data[1]['positionX'][3] != null ? data[1]['positionX'][3] : 575}
                y={data.length == 0 ? 70 : data[1]['positionY'][3] != null ? data[1]['positionY'][3] : 70} />
        </>
    );
}
