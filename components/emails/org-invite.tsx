interface OrgInviteEmailProps {
  orgName: string;
  inviteLink: string;
}

export const OrgInviteEmail = ({
  orgName,
  inviteLink,
}: OrgInviteEmailProps) => {
  return (
    <div>
      You&apos;re invited to join {orgName}!{" "}
      <a href={inviteLink}>Click here to accept the invitation</a>
    </div>
  );
};
