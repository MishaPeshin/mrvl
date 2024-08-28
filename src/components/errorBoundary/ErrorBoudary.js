import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";


// предохранитель ЛОВИТ ошибки только в метод render, в методах жизненного цикла и в конструкторах дочерних компонентов
// предохранитель НЕ ЛОВИТ ошибки в обработчиках событий(потому что события происходят вне метода render) и в асинхронном коде
class ErrorBoudary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessage />
        }

        return this.props.children
    }
}

export default ErrorBoudary;