import Chip from "../components/Chip";
import { getTotalMoney, setTotalMoney, addMoney, subtractMoney, resetMoney } from "../utils/globalState";

export default function Home() {

  return (
    <div>
      <Chip value={10} displayText="10" color="#e74c3c" x={100} y={100} />
    </div>
  );
}
