type Props = {
  src: string;
};

export function AudioPlayer({ src }: Props) {
  return <audio controls className="w-full" src={src} />;
}
