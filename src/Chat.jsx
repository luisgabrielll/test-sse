import { useEffect, useState } from "react";

const App = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://api.product.markts.abcdev.net/sse/notifications"
    );
    console.log("meu evento", eventSource);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parseia os dados recebidos
        setOrders((prev) => [...prev, data]); // Adiciona o novo pedido à lista
      } catch (error) {
        console.error("Erro ao processar mensagem SSE:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE:", error);
      eventSource.close(); // Fecha a conexão em caso de erro
    };

    // Cleanup ao desmontar o componente
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Pedidos Recebidos</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <strong>Mensagem:</strong> {order.message} <br />
            <strong>Detalhes do Pedido:</strong> {JSON.stringify(order.order)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
