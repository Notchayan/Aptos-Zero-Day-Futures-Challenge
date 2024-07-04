export const textVariant = {

    initial: {
        y: -50,
        opacity: 0,
    },
    whileInView: (delay) => (
        {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                duration: .5,
                delay: delay,
            }
        }

    )
}


export const fadeIn = (direction, type, delay, duration) => {
    return {
        hidden: {
            x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
            y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
            opacity: 0,
        },
        show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: "easeOut",
            },
        },
    };
};

export const zoomIn = {

    initial: {
        scale: 0,
        opacity: 0,
    },
    whileInView: (delay) => ({
        scale: 1,
        opacity: 1,
        transition: {
            type: "tween",
            delay: delay,
            duration: 0.75,
            ease: "easeOut",
        },
    }),
};


export const Upward = {
    initial: {
        y: 100,
        opacity: 0,
    },
    whileInView: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.85
        }
    }

}

export const Downward = {
    initial: {
        y: 100,
        opacity: 0,
    },
    whileInView: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.85
        }
    }

}
export const Sideward = {
    initial: {
        x: -100,
        opacity: 0,
    },
    whileInView: {
        x: 0,
        opacity: 1,
        transition: {
            // type: "spring/",
            duration: 0.5
        }
    }
}
export const Sideward2 = {
    initial: {
        x: 100,
        opacity: 0,
    },
    whileInView: {
        x: 0,
        opacity: 1,
        transition: {
            // type: "spring/",
            duration: 0.5
        }
    }
}

export const Leftward = {
    initial: {
        x: -100,
        opacity: 0,
    },
    whileInView: (delay) => (
        {
            x: 0,
            opacity: 1,
            transition: {
                delay: delay * 0.2,
                duration: 0.45
            }
        }

    )
}
export const Rightward = {
    initial: {
        x: 100,
        opacity: 0,
    },
    whileInView: (delay) => (
        {
            x: 0,
            opacity: 1,
            transition: {
                delay: delay * 0.2,
                duration: 0.45
            }
        }

    )
}
export const Backward = {
    initial: {
        x: 0,
        opacity: 1,
    },
    whileInView: (delay) => (
        {
            x: -100,
            opacity: 0,
            transition: {
                delay: delay * 0.2,
                duration: 0.45
            }
        }

    )
}