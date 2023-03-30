<template>
    <div class="container right-panel-active">
        <!-- Sign Up -->
        <div class="container__form container--signup">
            <form action="#" class="form" id="form1">
                <h2 class="form__title">Sign Up</h2>
                <div class="user-box">
                    <input type="text" placeholder="Name" class="input" />
                    <input type="email" placeholder="Email" class="input" />
                    <input type="password" placeholder="Password" class="input" />
                    <input type="password" placeholder="PasswordCheck" class="input" />
                </div>
                <button class="btn">Sign Up</button>
            </form>
        </div>

        <!-- Sign In -->
        <div class="container__form container--signin">
            <form action="#" class="form" id="form2">
                <h2 class="form__title">Sign In</h2>
                <div class="user-box">
                    <input type="email" placeholder="Email" class="input" />
                    <input type="password" placeholder="Password" class="input" />
                    <a href="#" class="link">Forgot your password?</a>
                </div>
                <button class="btn">Sign In</button>
            </form>
        </div>

        <!-- Overlay -->
        <div class="container__overlay">
            <div class="overlay">
                <div class="overlay__panel overlay--left">
                    <button class="btn" id="signIn" @click="overlay__panelChange1()">Sign In</button>
                </div>
                <div class="overlay__panel overlay--right">
                    <button class="btn" id="signUp" @click="overlay__panelChange2()">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        overlay__panelChange1() {
            document.querySelector(".container").classList.remove("right-panel-active");
        },
        overlay__panelChange2() {
            document.querySelector(".container").classList.add("right-panel-active");
        },
    }
}
</script>

<style scoped>
.form__title {
    font-weight: 300;
    margin: 0;
    margin-bottom: 1.25rem;
}

.link {
    color: #333;
    font-size: 0.9rem;
    margin: 1.5rem 0;
    text-decoration: none;
    transition: 0.7s;
}

.link:hover {
    color: black;
    font-size: 1rem;
}

.container {
    background-color: #c0c0c0;
    border-radius: 0.7rem;
    box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
        0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
    height: 480px;
    max-width: 758px;
    overflow: hidden;
    position: relative;
    width: 100%;
    transform: translate(0%, max(calc((100vh - 500px) / 2), 59px));
}

.container__form {
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;
}

.container--signin {
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.right-panel-active .container--signin {
    transform: translateX(100%);
}

.container--signup {
    left: 0;
    opacity: 0;
    width: 50%;
    z-index: 1;
}

.container.right-panel-active .container--signup {
    animation: show 0.6s;
    opacity: 1;
    transform: translateX(100%);
    z-index: 5;
}

.container__overlay {
    height: 100%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 0;
    transition: transform 0.6s ease-in-out;
    width: 50%;
    z-index: 100;
}

.container.right-panel-active .container__overlay {
    transform: translateX(-100%);
}

.overlay {
    background-color: #525252;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    left: -100%;
    position: relative;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    width: 200%;
}

.container.right-panel-active .overlay {
    transform: translateX(50%);
}

.overlay__panel {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: absolute;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    width: 50%;
}

.overlay--left {
    transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
    transform: translateX(0);
}

.overlay--right {
    right: 0;
    transform: translateX(0);
}

.container.right-panel-active .overlay--right {
    transform: translateX(20%);
}

.btn {
    background-color: #888;
    background-image: linear-gradient(90deg, #999 0%, #666 74%);
    border-radius: 20px;
    border: 0px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    padding: 0.9rem 4rem;
    text-transform: uppercase;
    /* transition: transform 80ms ease-in; */
    transition: .75s;
}

.form>.btn {
    margin-top: 1.5rem;
}

.btn:hover {
    background-color: #333;
    color: #ccc;
    background-image: none;
}

.btn:active {
    transform: scale(0.95);
}

.btn:focus {
    outline: none;
}

.form {
    background-color: #c0c0c0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 100%;
    text-align: center;
}

.input {
    background-color: #fff;
    border: none;
    padding: 0.6rem 0.6rem;
    margin: 0.3rem 0;
    width: 100%;
}

.user-box {
    position: relative;
}

.user-box input {
    width: 100%;
    padding: 7px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
}


input:focus::placeholder {
    color: transparent;
    transition: color 0.3s ease-in-out;
}

@keyframes show {

    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }

    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}
</style>