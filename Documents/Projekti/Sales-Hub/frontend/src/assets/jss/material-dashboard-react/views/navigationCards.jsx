const navigationCards = theme => ({
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "200px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    opacity: "0.8",
    transition: "all .5s",
    boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.15)",

    "&:hover": {
      transform: "translateY(-1.2rem) scale(1.03)"
    }
  },
  cardBody: {
    display: "flex",
    alignItems: "center",
    width: "inherit"
    //alignItems: "flex-end"
  },
  titleDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.6)",
    height: "3rem",
    width: "inherit"
  }
});

export default navigationCards;
