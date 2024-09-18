import { Button } from "primereact/button";

function PageNotFound() {
  return (
    <div>
      <div>
        <div className="flex surface-section h-screen">
          <div className="w-12 sm:w-6 px-4 py-8 md:px-6 lg:px-8 align-self-center">
            <div className="border-left-2 border-pink-500">
              <span className="bg-white text-pink-500 font-bold text-2xl inline-block px-3">
                404
              </span>
            </div>
            <div className="mt-6 mb-5 font-bold text-6xl text-900 capitalize">
              Page not found
            </div>
            <p className="text-700 text-3xl mt-0 mb-6">
              Sorry, we could not find the page
            </p>
            <div>
              <Button
                label="Go To Login"
                icon="pi pi-home"
                size="large"
                aria-label="Go To Login"
                className="text-white"
                onClick={() => window.location.replace("/login")}
              />
            </div>
          </div>
          <div
            className="w-6 hidden sm:block"
            style={{
              background:
                "url(https://blocks.primereact.org/demo/images/blocks/feedback/404.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
