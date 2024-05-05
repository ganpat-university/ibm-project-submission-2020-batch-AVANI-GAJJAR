import { Tabs } from "antd";
import ReportPending from "../Components/ReportPending";
import Sidebar from "../Components/Sidebar";
import Reported from "../Components/Reported";


const Report = () => {
    const items = [
        {
            key: '1',
            label: 'Pending',
            children: <ReportPending />,
        },
        {
            key: '2',
            label: 'Reported',
            children: <Reported />,
        },
    ];


    return (
        <div className="flex bg-[#fff] min-h-screen">
            <Sidebar />
            <div className="ml-64 w-full">
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default Report;
