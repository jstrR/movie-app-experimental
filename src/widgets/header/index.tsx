import Link from "next/link";
import { AuthBar } from "~/features/auth/authBar";
// import { useTranslation } from "react-i18next";
// import { useStore } from "effector-react";

// import MenuItem from "@material-ui/core/MenuItem";

export const Header = () => {
  //const location = useLocation();
  //const { t } = useTranslation();

  //   const user = useStore(userModel.$currentUser);
  //   const isAuthenticated = useStore(userModel.$isAuthenticated);
  //   const viewsContext = useContext(ViewContext);

  //   const mobileControlsView = (
  //     <>
  //       <ButtonNav to="/profile">{t("common.myProfile")}</ButtonNav>
  //       {user?.token ? (
  //         <GoogleLogOut
  //           onClick={userModel.logOut}
  //           render={(renderProps: any) => (
  //             <ButtonGeneric
  //               onClick={renderProps.onClick}
  //               disabled={renderProps.disabled}
  //               event="logOut">
  //               {t("common.logOut")}
  //             </ButtonGeneric>
  //           )}
  //         />
  //       ) : (
  //         <ButtonGeneric event="logOut" onClick={userModel.logOut}>
  //           {t("common.logOut")}
  //         </ButtonGeneric>
  //       )}
  //     </>
  //   );

  //   const desktopControlsView = [
  //     { defaultComponent: true, props: { component: Link, to: "/profile" }, children: t("common.myProfile") },
  //     user?.token ? {
  //       component: GoogleLogOut,
  //       props: {
  //         render: (renderProps: any) => (
  //           <MenuItem
  //             onClick={renderProps.onClick}
  //             disabled={renderProps.disabled}>
  //             {t("common.logOut")}
  //           </MenuItem>
  //         )
  //       },
  //       onClick: userModel.logOut
  //     } : { defaultComponent: true, props: {}, children: t("common.logOut"), onClick: userModel.logOut }
  //   ];

  return (
    <header className="flex flex-col items-center justify-between border-b pb-5 pt-4 sm:flex-row">
      <h2 className="mb-4 flex justify-between text-2xl font-bold text-mainColor sm:mb-0 sm:ml-20">
        <Link href="/">Movie-App</Link>
      </h2>

      {/* <div className="header__controls">
        <SwitchLang />
        {isAuthenticated ? (
          viewsContext
            ? mobileControlsView
            : <FadeMenu menuItems={desktopControlsView} />
        ) : (
          <>
            <ButtonNav to={{ pathname: "/login", state: { from: location } }}>
              {t("common.logIn")}
            </ButtonNav>
            <ButtonNav to={{ pathname: "/signup", state: { from: location } }}>
              {t("common.signUp")}
            </ButtonNav>
          </>
        )}
      </div> */}
      <div className="flex flex-col items-center justify-between gap-y-4 sm:mr-20 sm:flex-row sm:gap-x-4 sm:gap-y-0">
        <AuthBar />
      </div>
    </header>
  );
};
