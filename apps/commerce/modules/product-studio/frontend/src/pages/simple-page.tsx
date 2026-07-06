type SimplePageProps = {
  heading: string;
};

export function SimplePage({ heading }: SimplePageProps) {
  return (
    <section>
      <h1>{heading}</h1>
    </section>
  );
}
