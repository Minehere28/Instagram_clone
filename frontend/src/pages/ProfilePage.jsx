import { useParams } from "react-router-dom";

function ProfilePage() {
  const { username } = useParams();

  return (
    <div className="simple-page">
      <h1>{username}&apos;s Profile</h1>
      <p>Profile details will be connected to API in the next step.</p>
    </div>
  );
}

export default ProfilePage;
