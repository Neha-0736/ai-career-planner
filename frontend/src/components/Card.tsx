type Props = {
  title: string;
  items: any[];
};

export default function Card({ title, items }: Props) {

  return (

    <div className="bg-white shadow-md rounded-xl p-5">

      <h3 className="font-semibold mb-3">{title}</h3>

      <ul className="list-disc pl-5 space-y-1">

        {items?.map((item:any, index:number) => {

          if (!item) return null;

          if (typeof item === "string") {
            return <li key={index}>{item}</li>;
          }

          if (item.skill && item.level && item.duration) {
            return <li key={index}>{item.skill} - {item.level} - {item.duration}</li>;
          }

          if (item.skill && item.course) {
            return <li key={index}>{item.skill}: {item.course}</li>;
          }

          if (item.skill && item.tutorial) {
            return <li key={index}>{item.skill}: {item.tutorial}</li>;
          }

          if (item.skill && item.project) {
            return <li key={index}>{item.skill}: {item.project}</li>;
          }

          if (item.tool) {
            return <li key={index}>{item.tool}</li>;
          }

          return null;

        })}

      </ul>

    </div>

  );

}