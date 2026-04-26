"use client";

export default function AccountSection({
  tc,
  accountName,
  setAccountName,
  accountEmail,
  setAccountEmail,
  accountPassword,
  setAccountPassword,
  accountPasswordConfirm,
  setAccountPasswordConfirm,
  accountLoading,
  handleUpdateProfileName,
  handleUpdateEmail,
  handleUpdatePassword,
}) {
  return (
    <div className="mt-10 rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
      <h3 className="text-xl text-[#f2e6cf]">
        {tc("accountTitle")}
      </h3>

      <p className="mt-3 text-sm text-[#a99c83]">
        {tc("accountSubtitle")}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        
        {/* NAME */}
        <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
          <label className="text-sm text-[#d9ccb1]">
            {tc("accountDisplayName")}
          </label>

          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5]"
          />

          <button
            onClick={handleUpdateProfileName}
            disabled={accountLoading}
            className="mt-4 border border-[#b6924f] px-4 py-2 text-xs uppercase"
          >
            {tc("accountSaveName")}
          </button>
        </div>

        {/* EMAIL */}
        <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
          <label className="text-sm text-[#d9ccb1]">
            {tc("accountEmail")}
          </label>

          <input
            type="email"
            value={accountEmail}
            onChange={(e) => setAccountEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5]"
          />

          <button
            onClick={handleUpdateEmail}
            disabled={accountLoading}
            className="mt-4 border border-[#b6924f] px-4 py-2 text-xs uppercase"
          >
            {tc("accountSaveEmail")}
          </button>
        </div>

        {/* PASSWORD */}
        <div className="lg:col-span-2 rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-sm text-[#d9ccb1]">
                {tc("accountNewPassword")}
              </label>
              <input
                type="password"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5]"
              />
            </div>

            <div>
              <label className="text-sm text-[#d9ccb1]">
                {tc("accountConfirmPassword")}
              </label>
              <input
                type="password"
                value={accountPasswordConfirm}
                onChange={(e) =>
                  setAccountPasswordConfirm(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5]"
              />
            </div>
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={accountLoading}
            className="mt-4 border border-[#b6924f] px-4 py-2 text-xs uppercase"
          >
            {tc("accountSavePassword")}
          </button>
        </div>
      </div>
    </div>
  );
}