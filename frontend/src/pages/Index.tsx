import MediaConverter from '@/components/MediaConverter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <MediaConverter />
        </div>
      </main>
    </div>
  );
};

export default Index;
