import {
    Assets,
    loadTextures,
    Texture,
} from 'pixi.js';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Application, useTick } from '@pixi/react';

export function BunnySprite() {
    // The Pixi.js `Sprite`
    const spriteRef = useRef(null)

    const [texture, setTexture] = useState(Texture.EMPTY)
    const [diceTexture, setDiceTexture] = useState(null)

    const [hero1, setHero1] = useState(Texture.EMPTY)
    const [hero2, setHero2] = useState(Texture.EMPTY)
    const [hero3, setHero3] = useState(Texture.EMPTY)
    const [hero4, setHero4] = useState(Texture.EMPTY)

    const [isActive1, setIsActive1] = useState(false)
    const [isActive2, setIsActive2] = useState(false)
    const [isActive3, setIsActive3] = useState(false)
    const [isActive4, setIsActive4] = useState(false)

    const [pace, setPace] = useState(0)
    const [location, setLocation] = useState(1)
    const [isDice, setIsDice] = useState(false)

    const [rotation, setRotation] = useState(0)

    const [positionX1, setPositionX1] = useState(265);
    const [positionY1, setPositionY1] = useState(530);

    function getRandomNumber() {
        const min = 1;
        const max = 6;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var count = 0
    var tmp = location

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
            tmp = location + number
        }
        else {
            setIsDice(false)
            setLocation(tmp)
            count = 0;
        }
    }, [isDice])

    var countPace = 0;

    const animateY = useCallback(() => {
        setPositionY1(previousState => {
            if (location < 6) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState - 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace < 6 && location >= 6) {
                if (countPace <= 40 * (pace + 1) && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (6 - location + pace))
                        return previousState - 3
                    else {
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    }
                }
                if (countPace > 40 * (pace + 1)) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 6 && location < 12) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState - 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 6 && location > 11 && location < 14) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (11 - location + pace))
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    else {
                        return previousState - 3
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 6 && location > 13 && location - pace < 11) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (11 - location + pace)) {
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    } else if (countPace > 40 * (11 - location + pace) && countPace <= 40 * (13 - location + pace)) {
                        return previousState - 3;
                    } else {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 11 && location < 14) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState - 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 11 && location > 13 && location < 19) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (13 - location + pace))
                        return previousState - 3
                    else {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 13 && location > 13 && location < 19) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState + 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace > 13 && location >= 19 && location - pace < 19) {
                if (countPace <= 40 * (pace + 1) && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (19 - location + pace))
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    else {
                        return previousState - 3
                    }
                }
                if (countPace > 40 * (pace + 1)) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }

            if (location - pace >= 19 && location < 25) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState - 3;
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 19 && location > 24 && location < 27) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (24 - location + pace))
                        return previousState - 3
                    else {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 19 && location > 26 && location - pace < 24) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (24 - location + pace)) {
                        return previousState - 3;
                    } else if (countPace > 40 * (24 - location + pace) && countPace <= 40 * (26 - location + pace)) {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    } else {
                        return previousState + 3;

                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 24 && location < 27) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState + 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 24 && location > 26 && location < 32) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (26 - location + pace))
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    else {
                        return previousState + 3
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 26 && location > 26 && location < 32) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState + 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace > 26 && location >= 32  && location - pace < 32) {
                if (countPace <= 40 * (pace + 1) && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (32 - location + pace))
                        return previousState + 3
                    else {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    }
                }
                if (countPace > 40 * (pace + 1)) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }

            if (location - pace >= 32 && location < 38) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState + 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 32 && location > 37 && location < 40) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (37 - location + pace))
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    else {
                        return previousState + 3
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 32 && location > 39 && location - pace < 37) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (37 - location + pace)) {
                        setPositionX1(previousState => {
                            return previousState + 3
                        })
                    } else if (countPace > 40 * (24 - location + pace) && countPace <= 40 * (39 - location + pace)) {                        
                        return previousState + 3;
                    } else {
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 37 && location < 40) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState + 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 37 && location > 39 && location < 45) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (39 - location + pace))
                        return previousState + 3
                    else {
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 39 && location > 39 && location < 45) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState - 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace > 39 && location >= 45 && location - pace < 45) {
                if (countPace <= 40 * (pace + 1) && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (45 - location + pace))
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    else {
                        return previousState + 3
                    }
                }
                if (countPace > 40 * (pace + 1)) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }

            if (location - pace >= 45 && location < 51) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState + 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 45 && location > 50 && location < 52) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (50 - location + pace))
                        return previousState + 3
                    else {
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 45 && location > 51 && location - pace < 50) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (50 - location + pace)) {
                        return previousState + 3;                        
                    } else if (countPace > 40 * (50 - location + pace) && countPace <= 40 * (51 - location + pace)) {    
                        setPositionX1(previousState => {
                            return previousState - 3
                        })             
                    } else {
                        return previousState - 3;
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 50 && location < 52) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    setPositionX1(previousState => {
                        return previousState - 3
                    })
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 50 && location > 51 && location < 57) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    if (countPace <= 40 * (51 - location + pace))
                        setPositionX1(previousState => {
                            return previousState - 3
                        })
                    else {
                        return previousState - 3
                    }
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            if (location - pace >= 51 && location > 51 && location < 57) {
                if (countPace <= 40 * pace && isActive1 == true) {
                    countPace = countPace + 3
                    return previousState - 3
                }
                if (countPace > 40 * pace) {
                    setIsActive1(!isActive1)
                    countPace = 0;
                }
            }
            return previousState
        })
    }, [isActive1])

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
        }
    }, [texture, hero1, hero2, hero3, hero4,]);

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
                onClick={() => setIsActive1(!isActive1)}
                texture={hero1}
                width={25}
                height={60}
                x={positionX1}
                y={positionY1} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive2(!isActive2)}
                texture={hero2}
                width={25}
                height={60}
                x={25}
                y={530} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive3(!isActive3)}
                texture={hero3}
                width={25}
                height={60}
                x={25}
                y={530} />
            <pixiSprite
                anchor={0.5}
                eventMode={'dynamic'}
                onClick={() => setIsActive4(!isActive4)}
                texture={hero4}
                width={25}
                height={60}
                x={25}
                y={530} />
        </>
    );
}
