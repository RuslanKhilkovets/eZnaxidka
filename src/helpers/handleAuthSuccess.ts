export const handleAuthSuccess = ({
  data: {
    data: {access_token, user},
  },
}) => {
  console.log(user);
  const {name, email, phone, photo, location} = user;

  return {
    access_token,
    user: {name, email, phone, photo, location},
  };
};

export default handleAuthSuccess;